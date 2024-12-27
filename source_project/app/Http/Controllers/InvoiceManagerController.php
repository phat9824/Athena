<?php

namespace App\Http\Controllers;

use App\Models\HoaDon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InvoiceManagerController extends Controller
{
    public function getAllInvoices(Request $request)
    {
        try {
            $sortOrder = $request->input('sort', 'desc'); // Default sort order is descending
            $status = $request->input('status', 'all');  // Default fetches all statuses

            // Fetch all invoices based on filters
            $invoices = HoaDon::getAllInvoices($sortOrder, $status);

            return response()->json($invoices, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching invoices: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching invoices.'], 500);
        }
    }

    public function getInvoiceDetails($id)
    {
        try {
            $invoiceDetails = HoaDon::getInvoiceDetails($id);

            if (!$invoiceDetails) {
                return response()->json(['error' => 'Invoice not found.'], 404);
            }

            return response()->json($invoiceDetails, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching invoice details: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while fetching invoice details.'], 500);
        }
    }
}
