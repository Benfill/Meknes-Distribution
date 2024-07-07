<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    function index(): \Illuminate\Http\JsonResponse
    {
        $clients = Cache::get('clients');
        if (!$clients) {
            $clients = Client::where('is_deleted', 'no')->get();
            Cache::put('clients', $clients, 1440);
        }
        $response = [
            'status' => 'success',
            'clients' => $clients
        ];
        return response()->json($response, 200);
    }

    function show($id): \Illuminate\Http\JsonResponse
    {
        $client = Client::where('id', $id)
            ->where('is_deleted', 'no')
            ->first();
        if ($client) {
            $response = [
                'status' => 'Success',
                'client' => $client
            ];
        } else {

            $response = [
                'status' => 'Success',
                'message' => "Client Isn't Found"
            ];
        }
        return response()->json($response);
    }

    function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'CIN_ICE' => 'required|string|unique:clients',
            'type' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address_exploitation' => 'required|string',
            'address_facturation' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        /*        $path = $request->CIN_file->store('cartes_national', 'public');*/

        $data = $request->only(
            'CIN_ICE',
            'type',
            'first_name',
            'last_name',
            'email',
            'phone',
            'address_exploitation',
            'suite_address_exploitation',
            'address_facturation',
            'suite_address_facturation',
            'role'
        );

        $client = Client::create($data);
        Cache::forget('clients');

        /*        $client->addMedia($path)
                    ->toMediaCollection();*/
        $response = [
            'status' => 'success',
            'message' => 'Client is created successfully.',
            'client' => $client,
        ];
        return response()->json($response);
    }

    function update(Request $request, string $id): \Illuminate\Http\JsonResponse
    {
        $data = $request->only(
            'CIN_ICE',
            'type',
            'first_name',
            'last_name',
            'email',
            'phone',
            'address_exploitation',
            'suite_address_exploitation',
            'address_facturation',
            'suite_address_facturation',
            'role'
        );
        $data['id'] = $id;

        $validator = Validator::make($data, [
            'id' => 'required|exists:client_files,id',
            'CIN_ICE' => ['required', 'string',
                Rule::unique('clients')->ignore($id),],
            'type' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address_exploitation' => 'required|string',
            'address_facturation' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $client = Client::findOrFail($id);
        if ($client['is_deleted'] === 'yes') {
            return response()->json([
                'errors' => "You Can't Update Client Who Is Archived"
            ], 422);
        }
        $client->update($data);
        Cache::forget('clients');

        return response()->json([
            'message' => 'Client updated successfully!',
            'client' => $client
        ]);
    }

    function softDelete($id): \Illuminate\Http\JsonResponse
    {
        $validator = validator(['id' => $id], [
            'id' => 'required|numeric|exists:clients,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $client = Client::find($id);
        $client->is_deleted = 'yes';
        $client->save();
        Cache::forget('clients');
        Cache::forget('client_files');
        return response()->json([
            'status' => 'success',
            'message' => 'Client Moved to the Archive Successfully',
        ]);
    }

    function destroy($id): \Illuminate\Http\JsonResponse
    {
        $client = Client::find($id);
        $client->delete();
        Cache::forget('clients');
        Cache::forget('client_files');
        return response()->json([
            'status' => 'Success',
            'message' => 'Client Deleted Successfully'
        ]);
    }
}
