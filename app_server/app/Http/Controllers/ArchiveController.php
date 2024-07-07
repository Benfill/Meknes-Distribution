<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientFile;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ArchiveController extends Controller
{
    function index(): \Illuminate\Http\JsonResponse
    {
        $response = [
            'status' => 'success',
            "clients" => Client::where('is_deleted', 'yes')->get(),
            "clientFiles" => ClientFile::where('is_deleted', 'yes')->get(),
            "products" => Product::where('is_deleted', 'yes')->get(),
            "suppliers" => Supplier::where('is_deleted', 'yes')->get(),
            "users" => User::where('is_deleted', 'yes')->get()
        ];

        return response()->json($response);
    }

    function restore(Request $request): \Illuminate\Http\JsonResponse
    {
        $id = $request->id;
        $category = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $request->category));

        $validator = Validator::make($request->all(), ['id' => "required|numeric|exists:$category,id",
            'category' => 'required|string']);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::update("UPDATE $category SET is_deleted = 'no' WHERE id = ?", [$id]);

        $response = [
            'status' => 'success',
            "message" => 'Item Restored Successfully'
        ];

        return response()->json($response);
    }
}
