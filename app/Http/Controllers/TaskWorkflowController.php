<?php

namespace App\Http\Controllers;

use App\Events\TaskStateChanged;
use App\Http\Resources\TaskWorkflowLogResource;
use App\Models\Task;
use App\Models\TaskWorkflowLog;
use App\Models\WorkflowTransition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TaskWorkflowController extends Controller
{
    public function transition(Request $request, Task $task)
    {
        $request->validate([
            'transition_id' => 'required|exists:workflow_transitions,id',
            'comment' => 'nullable|string|max:1000',
        ]);

        $transition = WorkflowTransition::with(['fromState', 'toState'])->findOrFail($request->transition_id);
        
        // Verify current state matches transition from_state
        if ($task->workflow_state_id !== $transition->from_state_id) {
            return back()->withErrors(['transition' => 'Invalid transition for current task state.']);
        }

        // Check if user has permission to perform this transition
        if ($task->team && !$task->team->canUserPerformTransition(Auth::user(), $transition)) {
            return back()->withErrors(['transition' => 'You do not have permission to perform this transition.']);
        }

        DB::transaction(function () use ($task, $transition, $request) {
            // Log the transition
            TaskWorkflowLog::create([
                'task_id' => $task->id,
                'from_state_id' => $task->workflow_state_id,
                'to_state_id' => $transition->to_state_id,
                'transition_id' => $transition->id,
                'performed_by' => Auth::id(),
                'team_id' => $task->team_id,
                'comment' => $request->comment,
                'performed_at' => now(),
            ]);

            // Update task state
            $task->update([
                'workflow_state_id' => $transition->to_state_id,
            ]);

            // Broadcast the change
            event(new TaskStateChanged($task, $transition, Auth::user()));
        });

        return back()->with('success', 'Task state updated successfully.');
    }

    public function history(Task $task)
    {
        $logs = TaskWorkflowLog::with(['fromState', 'toState', 'transition', 'performedBy', 'team'])
            ->where('task_id', $task->id)
            ->orderBy('performed_at', 'desc')
            ->get();

        return response()->json([
            'logs' => TaskWorkflowLogResource::collection($logs),
        ]);
    }

    public function availableTransitions(Task $task)
    {
        if (!$task->workflow_state_id || !$task->team) {
            return response()->json(['transitions' => []]);
        }

        $transitions = WorkflowTransition::with(['toState'])
            ->where('from_state_id', $task->workflow_state_id)
            ->where('is_active', true)
            ->get()
            ->filter(function ($transition) use ($task) {
                return $task->team->canUserPerformTransition(Auth::user(), $transition);
            });

        return response()->json([
            'transitions' => $transitions->map(function ($transition) {
                return [
                    'id' => $transition->id,
                    'name' => $transition->name,
                    'description' => $transition->description,
                    'to_state' => [
                        'id' => $transition->toState->id,
                        'name' => $transition->toState->name,
                        'color' => $transition->toState->color,
                    ],
                ];
            }),
        ]);
    }
}
