<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_workflow_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('transition_id')->constrained('workflow_transitions')->cascadeOnDelete();
            $table->json('allowed_roles'); // ['contributor', 'reviewer', 'approver', 'manager']
            $table->json('conditions')->nullable(); // Additional conditions
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['team_id', 'transition_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_workflow_permissions');
    }
};
