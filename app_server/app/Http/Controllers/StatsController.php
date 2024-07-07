<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientFile;
use App\Models\ClientFileAddress;
use App\Models\Commune;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    function searchStats($id): \Illuminate\Http\JsonResponse
    {
        $commune = Commune::where('id', $id)
            ->with('clientFiles.products.supplier', 'clientFiles.clients')
            ->first();

        if (!$commune) {
            return response()->json(['message' => 'Commune not found'], 404);
        }

        $products = [];
        $productIds = [];
        $totalClients = 0;
        $clientFilesCount = count($commune->clientFiles);

        foreach ($commune->clientFiles as $clientFile) {
            $totalClients += count($clientFile->clients);
            foreach ($clientFile->products as $product) {
                if (!in_array($product->id, $productIds)) {
                    $productIds[] = $product->id;
                    $products[] = $product;
                }
            }
        }

        $response = [
            'message' => 'success',
            'productsCount' => count($products),
            'products' => $products,
            'clientsCount' => $totalClients,
            'clientFilesCount' => $clientFilesCount,
            'data' => $commune,
        ];

        return response()->json($response, 200);
    }


    function index(): \Illuminate\Http\JsonResponse
    {
        $productsCount = count(Product::all());
        $clientsCount = count(Client::all());
        $clientFilesCount = count(ClientFile::all());
        $suppliersCount = count(Supplier::all());
        $response = [
            'message' => 'success',
            'productsCount' => $productsCount,
            'clientFilesCount' => $clientFilesCount,
            'clientsCount' => $clientsCount,
            'suppliersCount' => $suppliersCount,
        ];
        return response()->json($response, 200);
    }

    function searchByCommune($input): \Illuminate\Http\JsonResponse
    {
        $searchPrompt = '%' . strtoupper($input) . '%';
        $communeWithFiles = ClientFileAddress::with(['commune.clientFiles'])
            ->whereHas('commune', function ($query) use ($searchPrompt) {
                $query->where('full_address', 'like', $searchPrompt);
            })
            ->get();
        $response = [
            'message' => 'success',
            'searchedCommune' => $communeWithFiles
        ];
        return response()->json($response, 200);
    }

    function getCommunes(): \Illuminate\Http\JsonResponse
    {
        $communes = ClientFileAddress::all();
        $response = [
            'message' => 'success',
            'communes' => $communes
        ];
        return response()->json($response, 200);
    }

    function trendingGroup(): \Illuminate\Http\JsonResponse
    {
        $groups = ClientFile::join('client_file_products', 'client_files.id', '=', 'client_file_products.client_file_id')
            ->join('products', 'client_file_products.product_id', '=', 'products.id')
            ->join('sub_categories as g', 'products.sub_category_id', '=', 'g.id')
            ->join('categories as c', 'g.category_id', '=', 'c.id')
            ->groupBy('products.id', 'g.name', 'c.name')
            ->selectRaw('products.id, products.designation, COUNT(*) as total, g.name as group_name, c.name as category_name')
            ->orderByDesc('total')
            ->get();


        $response = [
            'message' => 'success',
            'trendingGroups' => $groups
        ];
        return response()->json($response, 200);
    }

    function getTrendingCommune(): \Illuminate\Http\JsonResponse
    {
        $trending = DB::table('communes')
            ->select('communes.id', 'communes.name', DB::raw('COUNT(client_files.id) AS nbr'))
            ->join('client_files', 'communes.id', '=', 'client_files.commune_id')
            ->groupBy('communes.id', 'communes.name')
            ->orderByDesc('nbr')
            ->limit(4)
            ->get();

        return response()->json([
            'status' => 'success',
            'trending' => $trending
        ]);
    }

    function getProductsStats(): \Illuminate\Http\JsonResponse
    {
        // Determine the database driver (MySQL, PostgreSQL, SQLite)
        $driver = DB::connection()->getDriverName();

        // Adjust date handling based on database driver
        $dateSubtraction = match ($driver) {
            'pgsql' => "current_date - interval '12 months'",
            'mysql' => "DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)",
            default => "date('now', '-12 months')",
        };

        // Build the query using Laravel's query builder
        $data = DB::table('client_file_products')
            ->select(DB::raw('COUNT(products.id) AS product_total, communes.name, EXTRACT(MONTH FROM client_files.created_at) AS created_month'))
            ->join('products', 'client_file_products.product_id', '=', 'products.id')
            ->join('client_files', 'client_file_products.client_file_id', '=', 'client_files.id')
            ->join('communes', 'client_files.commune_id', '=', 'communes.id')
            ->whereRaw("client_files.created_at > $dateSubtraction")
            ->groupBy('communes.name', DB::raw('EXTRACT(MONTH FROM client_files.created_at)'))
            ->orderBy('created_month')
            ->orderByDesc('product_total')
            ->limit(5)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
