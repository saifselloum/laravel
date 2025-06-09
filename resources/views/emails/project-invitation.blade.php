<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Invitation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
        }
        .project-info {
            background-color: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #0ea5e9;
        }
        .project-name {
            font-size: 20px;
            font-weight: bold;
            color: #0ea5e9;
            margin-bottom: 10px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background-color: #059669;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 10px 20px 0;
            text-align: center;
        }
        .btn-decline {
            background-color: #dc2626;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }
        .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            color: #92400e;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Project Manager</div>
            <h1>You're Invited to Join a Project!</h1>
        </div>

        <p>Hello!</p>
        
        <p><strong>{{ $invitedBy->name }}</strong> has invited you to join their project on our platform.</p>

        <div class="project-info">
            <div class="project-name">{{ $project->name }}</div>
            @if($project->description)
                <p><strong>Description:</strong> {{ $project->description }}</p>
            @endif
            <p><strong>Invited by:</strong> {{ $invitedBy->name }} ({{ $invitedBy->email }})</p>
            <p><strong>Due Date:</strong> {{ $project->due_date ? \Carbon\Carbon::parse($project->due_date)->format('M j, Y') : 'Not set' }}</p>
        </div>

        <p>By accepting this invitation, you'll be able to:</p>
        <ul>
            <li>View and manage project tasks</li>
            <li>Collaborate with team members</li>
            <li>Participate in project discussions</li>
            <li>Access project resources and files</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $acceptUrl }}" class="btn">Accept Invitation</a>
        </div>

        <div class="warning">
            <strong>⚠️ Important:</strong> This invitation will expire on <strong>{{ $expiresAt }}</strong>. 
            Please accept or decline before this date.
        </div>

        <p>If you don't want to join this project, you can simply ignore this email or click the decline button when you visit the invitation link.</p>

        <p>If you have any questions about this invitation, please contact {{ $invitedBy->name }} directly.</p>

        <div class="footer">
            <p>This invitation was sent to {{ $invitation->email }}.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            <p>&copy; {{ date('Y') }} Project Manager. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
