<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Utilisateur Inscrit</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 20px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            🔔 Nouveau Utilisateur Inscrit
        </div>
        
        <div class="content">
            <p>Bonjour Admin,</p>
            <p>Un nouvel utilisateur vient de s'inscrire sur la plateforme :</p>

            <ul>
                <li><strong>Nom :</strong> {{ $user->name }}</li>
                <li><strong>Email :</strong> {{ $user->email }}</li>
            </ul>

           

            

            <p>Merci et bonne journée !</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} - Votre Entreprise | Tous droits réservés
        </div>
    </div>

</body>
</html>