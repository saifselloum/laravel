<?php

namespace App\Mail;

use App\Models\ProjectInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProjectInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $invitation;

    /**
     * Create a new message instance.
     */
    public function __construct(ProjectInvitation $invitation)
    {
        $this->invitation = $invitation->load(['project', 'invitedBy']);
        
        Log::info('ProjectInvitationMail created', [
            'invitation_id' => $this->invitation->id,
            'project_name' => $this->invitation->project->name,
            'invited_email' => $this->invitation->email
        ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You\'re invited to join "' . $this->invitation->project->name . '"',
            from: config('mail.from.address', 'noreply@example.com'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.project-invitation',
            with: [
                'invitation' => $this->invitation,
                'project' => $this->invitation->project,
                'invitedBy' => $this->invitation->invitedBy,
                'acceptUrl' => route('invitations.show', $this->invitation->token),
                'expiresAt' => $this->invitation->expires_at->format('M j, Y \a\t g:i A'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
