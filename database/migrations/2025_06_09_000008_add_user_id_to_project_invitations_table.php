<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_invitations', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('email')->constrained()->onDelete('cascade');
            $table->index(['project_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_invitations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['project_id', 'user_id']);
            $table->dropColumn('user_id');
        });
    }
};
