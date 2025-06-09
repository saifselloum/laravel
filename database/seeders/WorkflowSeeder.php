<?php

namespace Database\Seeders;

use App\Models\WorkflowState;
use App\Models\WorkflowTransition;
use Illuminate\Database\Seeder;

class WorkflowSeeder extends Seeder
{
    public function run(): void
    {
        // Create workflow states
        $states = [
            ['name' => 'To Do', 'slug' => 'todo', 'color' => '#6B7280', 'order' => 1, 'is_initial' => true],
            ['name' => 'In Progress', 'slug' => 'in-progress', 'color' => '#3B82F6', 'order' => 2],
            ['name' => 'Review', 'slug' => 'review', 'color' => '#F59E0B', 'order' => 3],
            ['name' => 'Testing', 'slug' => 'testing', 'color' => '#8B5CF6', 'order' => 4],
            ['name' => 'Done', 'slug' => 'done', 'color' => '#10B981', 'order' => 5, 'is_final' => true],
        ];

        $createdStates = [];
        foreach ($states as $stateData) {
            $createdStates[$stateData['slug']] = WorkflowState::create($stateData);
        }

        // Create workflow transitions
        $transitions = [
            [
                'from' => 'todo',
                'to' => 'in-progress',
                'name' => 'Start Work',
                'description' => 'Begin working on the task',
            ],
            [
                'from' => 'in-progress',
                'to' => 'review',
                'name' => 'Submit for Review',
                'description' => 'Submit completed work for review',
            ],
            [
                'from' => 'review',
                'to' => 'in-progress',
                'name' => 'Request Changes',
                'description' => 'Send back for modifications',
            ],
            [
                'from' => 'review',
                'to' => 'testing',
                'name' => 'Approve for Testing',
                'description' => 'Approve and move to testing phase',
                'requires_approval' => true,
            ],
            [
                'from' => 'testing',
                'to' => 'in-progress',
                'name' => 'Failed Testing',
                'description' => 'Testing failed, return to development',
            ],
            [
                'from' => 'testing',
                'to' => 'done',
                'name' => 'Complete Task',
                'description' => 'Mark task as completed',
                'requires_approval' => true,
            ],
            [
                'from' => 'todo',
                'to' => 'done',
                'name' => 'Cancel Task',
                'description' => 'Cancel the task without completion',
            ],
        ];

        foreach ($transitions as $transitionData) {
            WorkflowTransition::create([
                'from_state_id' => $createdStates[$transitionData['from']]->id,
                'to_state_id' => $createdStates[$transitionData['to']]->id,
                'name' => $transitionData['name'],
                'description' => $transitionData['description'],
                'requires_approval' => $transitionData['requires_approval'] ?? false,
            ]);
        }
    }
}
