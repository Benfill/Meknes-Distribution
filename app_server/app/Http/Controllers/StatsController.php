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
        $trending = DB::select("
            SELECT communes.id, communes.name, COUNT(client_files.id) AS nbr
            FROM communes
            INNER JOIN client_files ON communes.id = client_files.commune_id
            GROUP BY communes.id
             ORDER BY nbr DESC
             LIMIT 4
");

        return response()->json([
            'status' => 'success',
            'trending' => $trending
        ]);
    }

    function getProductsStats(): \Illuminate\Http\JsonResponse
    {
        $data = DB::select("
                WITH ranked_data AS (
                SELECT
                    COUNT(products.id) AS product_total,
                    communes.name,
                    EXTRACT(MONTH FROM client_files.created_at) AS created_month,
                    ROW_NUMBER() OVER (PARTITION BY EXTRACT(MONTH FROM client_files.created_at) ORDER BY COUNT(products.id) DESC) AS rank
                FROM client_file_products
                INNER JOIN products ON client_file_products.product_id = products.id
                INNER JOIN client_files ON client_file_products.client_file_id = client_files.id
                INNER JOIN communes ON client_files.commune_id = communes.id
                WHERE client_files.created_at > (CURRENT_DATE - INTERVAL '12 months')
                GROUP BY communes.name, EXTRACT(MONTH FROM client_files.created_at)
                )
                SELECT product_total, name, created_month
                FROM ranked_data
                WHERE rank <= 5
                ORDER BY created_month, product_total DESC;
        ");

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
