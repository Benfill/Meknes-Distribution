<?php

namespace App\Models;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ClientFile extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'file_name',
        'commune_id',
        'exploitation_surface',
        'more_detail',
        'full_address',
        'is_deleted'
    ];

    /**
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     */
    function makeInfosFile(): string
    {
        $pdf = Pdf::loadView('infosFile_template', ['file' => $this])
            ->setPaper('a4')
            ->output();

        $this->addMediaFromString($pdf)
            ->usingFileName($this->file_name . '.pdf')
            ->toMediaCollection('infos');

        return $pdf;
    }

    function clients(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Client::class, 'client_partners');
    }

    function commune(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }

    function products(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'client_file_products');
    }

    function deliveryNotes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(DeliveryNote::class, 'client_file_delivery_note');
    }

    function invoices(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Invoice::class, 'client_file_invoice');
    }

    // Define relationship for folders
    public function subfolders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ClientFile::class, 'parent_id');
    }

    // Define relationship for parent folder
    public function parentFolder(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ClientFile::class, 'parent_id');
    }

    // Define a scope for non-deleted files
    public function scopeActive($query)
    {
        return $query->where('is_deleted', 'no');
    }
}
