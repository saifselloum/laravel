<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop all workflow-related tables in the correct order
        Schema::dropIfExists('task_workflow_logs');
        Schema::dropIfExists('team_workflow_permissions');
        Schema::dropIfExists('workflow_transitions');
        Schema::dropIfExists('workflow_states');
    }

    public function down(): void
    {
        // We won't recreate these tables in the down method
        // as they would require complex structure recreation
    }
};
