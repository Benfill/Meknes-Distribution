<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Informations sur le Dossier</title>
    <style>
        @page {
            size: A4;
            margin: 1cm;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            font-size: 10pt;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 21cm;
            margin: auto;
            padding: 0.5cm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100vh;
        }

        .header {
            text-align: center;
            margin-bottom: 0.5cm;
        }

        .header h1 {
            font-size: 14pt;
            margin: 0;
        }

        .section {
            margin-bottom: 0.5cm;
        }

        .section h2 {
            font-size: 12pt;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
            margin-top: 0.3cm;
            margin-bottom: 0.2cm;
        }

        .section-content {
            margin-top: 0.2cm;
        }

        .label {
            font-weight: bold;
            width: 4cm;
            display: inline-block;
        }

        .contact-info {
            text-align: center;
            margin-top: 0.5cm;
            font-size: 9pt;
            justify-self: end;
        }

        p {
            margin: 0.1cm 0;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Informations sur le Dossier {{ $file->file_name }}</h1>
    </div>

    <div class="section">
        <h2>Détails de Base</h2>
        <div class="section-content">
            <p><span class="label">Nom du Fichier:</span> {{ $file->file_name }}</p>
            <p><span class="label">Surface d'Exploitation:</span> {{ $file->exploitation_surface }} m²</p>
            <p><span
                    class="label">Adresse Complète:</span> {{ str_contains($file->full_address, "(M)") ? str_replace('(M)', '', $file->full_address)  : $file->full_address }}
            </p>
        </div>
    </div>

    <div class="section">
        <h2>Détails Supplémentaires</h2>
        <div class="section-content">
            <p><span class="label">Plus de Détails:</span> {{ $file->more_detail }}</p>
        </div>
    </div>

    <div class="section">
        <h2>Informations Connexes</h2>
        <div class="section-content">
            <p><span class="label">Commune:</span> {{ $file->commune->name }}</p>
            <p><span class="label">Clients:</span>
                @foreach ($file->clients as $client)
                    {{ $client->first_name . " " . $client->last_name }}@if (!$loop->last)
                        ,
                    @endif
                @endforeach
            </p>
            <p><span class="label">Produits:</span>
                @foreach ($file->products as $product)
                    {{ $product->designation }}@if (!$loop->last)
                        ,
                    @endif
                @endforeach
            </p>
        </div>
    </div>

    <div class="contact-info">
        <p>Téléphone: 05355-25814</p>
        <p>Adresse: Agropolis, iS1.14, Sidi Slimane Moule El Kifane 50122</p>
    </div>
</div>
</body>
</html>
