<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = Cache::get('suppliers');
        if (!$suppliers) {
            $suppliers = Supplier::where('is_deleted', 'no')->get();
            Cache::put('suppliers', $suppliers, 1440);
        }
        $response = [
            'message' => 'success',
            'suppliers' => $suppliers
        ];
        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }


    function softDelete($id): \Illuminate\Http\JsonResponse
    {
        $validator = validator(['id' => $id], [
            'id' => 'required|numeric|exists:suppliers,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $supplier = Supplier::find($id);
        $supplier->is_deleted = 'yes';
        $supplier->save();
        Cache::forget('suppliers');
        return response()->json([
            'status' => 'success',
            'message' => 'Product Moved to the Archive Successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
