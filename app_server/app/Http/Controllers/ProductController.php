<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    function index(): \Illuminate\Http\JsonResponse
    {
        $products = Cache::get('products');
        if (!$products) {
            $products = Product::where('is_deleted', 'no')
                ->with(['subCategory.category', 'supplier'])
                ->get();
            Cache::put('products', $products, 1440);
        }
        $response = [
            'message' => 'success',
            'products' => $products
        ];
        return response()->json($response, 200);
    }

    function store(Request $request): \Illuminate\Http\JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'reference' => 'required|string',
            'designation' => 'required|string',
            'prix_tarif' => 'required|numeric',
            'prix_achat' => 'required|numeric',
            'prix_vente' => 'required|numeric',
            'marge_brut' => 'required|numeric',
            'remise' => 'required|numeric',
            'TVA' => 'required|numeric',
            'prix_vente_net' => 'required|numeric',
            'sub_category_id' => 'required|numeric|exists:sub_categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imageChecker = false;
        if (isset($request->image)) {
            $validator = Validator::make($request->all(), [
                'image' => 'required|file|mimes:jpg,png,jpeg'
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $path = $request->file('image')->store('products/picture', 'public');
            $imageChecker = true;
        }

        $data = $request->only(
            'reference',
            'designation',
            'image',
            'prix_tarif',
            'prix_achat',
            'prix_vente',
            'marge_brut',
            'remise',
            'TVA',
            'prix_vente_net',
            'sub_category_id',
            'supplier_id'
        );


        $product = Product::create($data);
        if ($imageChecker) {
            $product->addMedia(storage_path('app/public/' . $path))->toMediaCollection('product_picture');
            $mediaItems = $product->getMedia('user_picture');
            $publicUrl = $mediaItems[0]->getUrl();
            $product->image = $publicUrl;
            $product->save();
        }
        $products = Product::where('is_deleted', 'no')
            ->with(['subCategory.category', 'supplier'])
            ->get();
        Cache::forget('products');
        Cache::put('products', $products, 1440);
        $response = [
            'status' => 'success',
            'message' => 'Product is created successfully.',
            'product' => $product,
            'products' => $products,
        ];
        return response()->json($response);
    }

    function update(Request $request, string $id): \Illuminate\Http\JsonResponse
    {
        $data = $request->only(
            'reference',
            'designation',
            'image',
            'prix_tarif',
            'prix_achat',
            'prix_vente',
            'marge_brut',
            'remise',
            'TVA',
            'prix_vente_net',
            'sub_category_id',
            'supplier_id'
        );
        $data['id'] = $id;

        $validator = Validator::make($data, [
            'reference' => 'required|string',
            'designation' => 'required|string',
            'prix_tarif' => 'required|numeric',
            'prix_achat' => 'required|numeric',
            'prix_vente' => 'required|numeric',
            'marge_brut' => 'required|numeric',
            'remise' => 'required|numeric',
            'TVA' => 'required|numeric',
            'prix_vente_net' => 'required|numeric',
            'sub_category_id' => 'required|numeric|exists:sub_categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::findOrFail($id);
        if ($product['is_deleted'] === 'yes') {
            return response()->json([
                'errors' => "You Can't Update Product Who Is Archived"
            ], 422);
        }
        $product->update($data);
        Cache::forget('products');
        Cache::forget('client_files');

        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => $product
        ]);
    }

    function show($id): \Illuminate\Http\JsonResponse
    {
        $product = Product::where('id', $id)
            ->where('is_deleted', 'no')
            ->first();
        if ($product) {
            $response = [
                'status' => 'Success',
                'product' => $product
            ];
        } else {

            $response = [
                'status' => 'Success',
                'message' => "Product Isn't Found"
            ];
        }
        return response()->json($response);
    }

    function softDelete($id): \Illuminate\Http\JsonResponse
    {
        $validator = validator(['id' => $id], [
            'id' => 'required|numeric|exists:products,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $product = Product::find($id);
        $product->is_deleted = 'yes';
        $product->save();
        Cache::forget('products');
        Cache::forget('client_files');
        return response()->json([
            'status' => 'success',
            'message' => 'Product Moved to the Archive Successfully',
        ]);
    }

    function destroy($id): \Illuminate\Http\JsonResponse
    {
        $product = Product::find($id);
        $product->delete();
        Cache::forget('products');
        Cache::forget('client_files');
        return response()->json([
            'status' => 'Success',
            'message' => 'Product Deleted Successfully',
        ]);
    }

}
