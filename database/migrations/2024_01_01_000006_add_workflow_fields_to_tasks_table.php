<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('workflow_state_id')->nullable()->after('status')->constrained('workflow_states');
            $table->foreignId('team_id')->nullable()->after('project_id')->constrained();
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['workflow_state_id']);
            $table->dropForeign(['team_id']);
            $table->dropColumn(['workflow_state_id', 'team_id']);
        });
    }
};
