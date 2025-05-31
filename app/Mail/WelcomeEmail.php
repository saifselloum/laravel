<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

   /**public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Our Application!',
        );
    }*/

    /**
     * Get the message content definition.
     */
    /*public function content(): Content
    {
        return new Content(
            view: 'emails.welcome.blade',
            with: [
                'user' => $this->user,
            ],
        );
    }/
    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function build()
    {
        return $this->subject('New User Registration')
            ->view('emails.welcome')
            ->with([
                'user' => $this->user,
            ]);
    }
    public function attachments(): array
    {
        return[];
    }
}
