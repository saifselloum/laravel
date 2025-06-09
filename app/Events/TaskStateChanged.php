<?php

namespace App\Events;

use App\Models\Task;
use App\Models\User;
use App\Models\WorkflowTransition;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStateChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Task $task,
        public WorkflowTransition $transition,
        public User $user
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('task.' . $this->task->id),
            new PrivateChannel('project.' . $this->task->project_id),
            new PrivateChannel('team.' . $this->task->team_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.state.changed';
    }

    public function broadcastWith(): array
    {
        return [
            'task_id' => $this->task->id,
            'task_name' => $this->task->name,
            'from_state' => $this->transition->fromState->name,
            'to_state' => $this->transition->toState->name,
            'transition_name' => $this->transition->name,
            'performed_by' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toISOString(),
        ];
    }
}
