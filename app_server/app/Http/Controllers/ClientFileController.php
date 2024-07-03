<?php

namespace App\Http\Controllers;

use App\Models\ClientFile;
use App\Models\ClientFileAddress;
use App\Models\ClientFileProduct;
use App\Models\ClientPartner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\MediaStream;

class ClientFileController extends Controller
{
    function index(): \Illuminate\Http\JsonResponse
    {
        $clientFiles = Cache::get('client_files');

        if (!$clientFiles) {
            $clientFiles = ClientFile::where('is_deleted', 'no')
                ->with([
                    'invoices',
                    'deliveryNotes',
                    'commune.caidat.cercle.province.region',
                    'products.subCategory.category',
                    'clients',
                    'media'
                ])
                ->get();
            Cache::put('client_files', $clientFiles, 1440);
        }

        $response = [
            'message' => 'success',
            'clientFiles' => $clientFiles
        ];
        return response()->json($response, 200);
    }

    function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file_name' => 'required|string|max:255|unique:client_files',
            'client_ids' => 'required|array',
            'client_ids.*' => 'required|numeric|exists:clients,id',
            'commune_id' => 'required|numeric|exists:communes,id',
            'product_ids' => 'required|array',
            'product_ids.*' => 'required|numeric|exists:products,id',
            'exploitation_surface' => 'required|numeric',
            'files' => 'nullable|array',
            'files.*' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(
            'file_name',
            'commune_id',
            'more_detail',
            'exploitation_surface'
        );

        $fullAddress = ClientFileAddress::where('commune_id', $data['commune_id'])->first();
        $data['full_address'] = $fullAddress['full_address'];

        $clientFile = ClientFile::create($data);


        // Attach clients and products
        foreach ($request['client_ids'] as $id) {
            ClientPartner::create([
                'client_file_id' => $clientFile->id,
                'client_id' => $id
            ]);
        }

        foreach ($request['product_ids'] as $id) {
            ClientFileProduct::create([
                'client_file_id' => $clientFile->id,
                'product_id' => $id
            ]);
        }

        // Handle file upload with Media Library
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $clientFile->addMedia($file)->toMediaCollection($data['file_name']);
            }
        }

        $clientFile->makeInfosFile();

        // Clear cache and return response
        Cache::forget('client_files');
        Cache::forget('clients');
        Cache::forget('products');
        $clientFiles = ClientFile::where('is_deleted', 'no')
            ->with([
                'invoices',
                'deliveryNotes',
                'commune.caidat.cercle.province.region',
                'products.subCategory.category',
                'clients',
                'media'
            ])
            ->get();
        Cache::put('client_files', $clientFiles, 1440);

        $response = [
            'status' => 'success',
            'message' => 'ClientFile is created successfully.',
            'clientFile' => $clientFile,
            'clientFiles' => $clientFiles,
        ];

        return response()->json($response);
    }

    function update(Request $request, string $id): \Illuminate\Http\JsonResponse
    {
        $data = $request->only(
            'file_name',
            'commune_id',
            'more_detail',
            'exploitation_surface'
        );
        $data['id'] = $id;

        $validator = Validator::make($data, [
            'file_name' => ['required', 'string', 'max:255',
                Rule::unique('client_files')->ignore($id),],
            'commune_id' => 'required|numeric|exists:communes,id',
            'more_detail' => 'nullable|string',
            'exploitation_surface' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }


        $clientFile = ClientFile::findOrFail($id);
        if ($clientFile['is_deleted'] === 'yes') {
            return response()->json([
                'errors' => "You Can't Update ClientFile Who Is Archived"
            ], 422);
        }
        $clientFile->update($data);

        // Attach clients and products
        if ($request->has('client_ids')) {
            $clientFile->clients()->sync($request->input('client_ids'));
        }

        if ($request->has('product_ids')) {
            $clientFile->products()->sync($request->input('product_ids'));
        }

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Generate a hash of the file content
                $fileHash = md5_file($file->getPathname());

                // Check if a media item with this hash already exists in the collection
                $existingMedia = $clientFile->getMedia($data['file_name'])->first(function ($mediaItem) use ($fileHash) {
                    return $mediaItem->getCustomProperty('file_hash') === $fileHash;
                });

                // If no media item with this hash exists, add the new file to the collection
                if (!$existingMedia) {
                    $clientFile->addMedia($file)
                        ->withCustomProperties(['file_hash' => $fileHash])
                        ->toMediaCollection($data['file_name']);
                }
            }
        }

        $clientFile->makeInfosFile();
        // Clear cache and return response
        Cache::forget('client_files');
        Cache::forget('clients');
        Cache::forget('products');
        $clientFiles = ClientFile::where('is_deleted', 'no')
            ->with([
                'invoices',
                'deliveryNotes',
                'commune.caidat.cercle.province.region',
                'products.subCategory.category',
                'clients',
                'media'
            ])
            ->get();
        Cache::put('client_files', $clientFiles, 1440);

        $response = [
            'status' => 'success',
            'message' => 'ClientFile is updated successfully.',
            'clientFile' => $clientFile,
            'clientFiles' => $clientFiles,
        ];

        return response()->json($response);
    }

    function download($id): MediaStream|\Illuminate\Http\JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|numeric|exists:client_files,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $clientFile = ClientFile::find($id);
        $medias = $clientFile->getMedia('*');

        if (!$medias) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return MediaStream::create($clientFile->file_name . '.zip')->addMedia($medias);

    }

    function filesDownload(Request $request): MediaStream|\Illuminate\Http\JsonResponse
    {
        $clientFileId = $request->input('client_file_id');
        $data = [
            'file_ids' => $request->input('file_ids'),
            'client_file_id' => $clientFileId
        ];
        $validator = Validator::make($data, [
            'file_ids' => 'required|array',
            'file_ids.*' => 'required|numeric|exists:media,id',
            'client_file_id' => 'required|numeric|exists:client_files,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $clientFile = ClientFile::find($clientFileId);

        if (!$clientFile) {
            return response()->json(['error' => 'Client file not found'], 404);
        }

        $medias = $clientFile->getMedia('*')->whereIn('id', $data['file_ids']);

        if ($medias->isEmpty()) {
            return response()->json(['error' => 'No media found for the given IDs'], 404);
        }

        $zipName = $clientFile->file_name . '.zip';
        return MediaStream::create($zipName)->addMedia($medias);
    }

    function fileDownload($clientFileId, $fileId): \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
    {
        $data = [
            'file_id' => $fileId,
            'client_file_id' => $clientFileId
        ];
        $validator = Validator::make($data, [
            'file_id' => 'required|numeric|exists:media,id',
            'client_file_id' => 'required|numeric|exists:client_files,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $clientFile = ClientFile::find($clientFileId);

        if (!$clientFile) {
            return response()->json(['error' => 'Client file not found'], 404);
        }

        $media = $clientFile->getMedia('*')->where('id', $fileId)->first();

        if (!$media) {
            return response()->json(['error' => 'No media found for the given ID'], 404);
        }

        return response()->download($media->getPath(), $media->file_name);
    }

    function rename(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file_id' => 'required|numeric|exists:media,id',
            'newName' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $fileId = $request->input('file_id');
        $newName = $request->input('newName');
        $media = Media::findOrFail($fileId);
        if ($media) {
            $media->update(['file_name' => $newName]);
            Cache::forget('client_files');
        }
        return response()->json([
            'message' => 'Media renamed successfully',
            'media' => $media
        ], 200);
    }

    function deleteFile(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file_id' => 'required|numeric|exists:media,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $fileId = $request->input('file_id');
        $media = Media::findOrFail($fileId);
        if ($media) {
            $media->delete();
            Cache::forget('client_files');
        }
        return response()->json([
            'message' => 'Media deleted successfully',
        ], 200);
    }

    function softDelete($id): \Illuminate\Http\JsonResponse
    {
        $validator = validator(['id' => $id], [
            'id' => 'required|numeric|exists:client_files,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $clientFile = ClientFile::findOrFail($id);
        $clientFile->is_deleted = 'yes';
        $clientFile->save();
        Cache::forget('client_files');
        return response()->json([
            'status' => 'success',
            'message' => 'Client File Moved to the Archive Successfully',
        ]);
    }

    function delete($id): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'fileId' => 'required|numeric|exists:client_files,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $clientFile = ClientFile::find($request->input('fileId'));
        if ($clientFile) {
            $clientFile->delete();
            Cache::forget('client_files');
        }

        return response()->json(['success' => true]);
    }

    function upload(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'client_file_id' => 'required|numeric|exists:client_files,id',
            'uploadFiles' => 'required|array', // Require files to be uploaded
            'uploadFiles.*' => 'file', // Each item should be a file
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            $clientFileId = $request->input('client_file_id');
            $clientFile = ClientFile::findOrFail($clientFileId);

            // Handle multiple file uploads
            if ($request->hasFile('uploadFiles')) {
                foreach ($request->file('uploadFiles') as $file) {
                    $clientFile->addMedia($file)->toMediaCollection('client_files');
                }
            }

            // Commit the transaction
            DB::commit();

            // Clear cache and return response
            Cache::forget('client_files');
            $clientFiles = ClientFile::where('is_deleted', 'no')
                ->with([
                    'invoices',
                    'deliveryNotes',
                    'commune.caidat.cercle.province.region',
                    'products.subCategory.category',
                    'clients',
                    'media'
                ])
                ->get();
            Cache::put('client_files', $clientFiles, 1440);

            $response = [
                'status' => 'success',
                'message' => 'Files attached to ClientFile successfully.',
                'clientFile' => $clientFile,
                'clientFiles' => $clientFiles,
            ];

            return response()->json($response);
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();

            // Log the error or handle it appropriately
            return response()->json(['message' => 'Error occurred while attaching files to client file.'], 500);
        }
    }
}
