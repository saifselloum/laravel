<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_workflow_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_state_id')->nullable()->constrained('workflow_states');
            $table->foreignId('to_state_id')->constrained('workflow_states');
            $table->foreignId('transition_id')->nullable()->constrained('workflow_transitions');
            $table->foreignId('performed_by')->constrained('users');
            $table->foreignId('team_id')->nullable()->constrained();
            $table->text('comment')->nullable();
            $table->json('metadata')->nullable(); // Additional data
            $table->timestamp('performed_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_workflow_logs');
    }
};
