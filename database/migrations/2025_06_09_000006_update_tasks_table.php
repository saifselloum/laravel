<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop workflow-related columns if they exist
            if (Schema::hasColumn('tasks', 'workflow_state_id')) {
                $table->dropForeign(['workflow_state_id']);
                $table->dropColumn('workflow_state_id');
            }
            
            if (Schema::hasColumn('tasks', 'team_id')) {
                $table->dropForeign(['team_id']);
                $table->dropColumn('team_id');
            }
            
            // Add new team_id column with nullable constraint
            $table->foreignId('team_id')->nullable()->after('project_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropColumn('team_id');
        });
    }
};
