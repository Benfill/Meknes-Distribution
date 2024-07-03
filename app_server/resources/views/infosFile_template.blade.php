<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Informations sur le Dossier</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }

        .container {
            width: 80%;
            margin: auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        .section-content {
            margin-top: 10px;
        }

        .label {
            font-weight: bold;
            width: 120px;
            display: inline-block;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .contact-info {
            text-align: center;
            margin-top: 20px;
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
            <p><span class="label">Adresse Complète:</span> {{ $file->full_address }}</p>
        </div>
    </div>

    <div class="section">
        <h2>Détails Supplémentaires</h2>
        <div class="section-content">
            <p><span class="label">Plus de Détails:</span> {{ $file->more_detail }}</p>
            <p><span class="label">Est Supprimé:</span> {{ $file->is_deleted ? 'Oui' : 'Non' }}</p>
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
