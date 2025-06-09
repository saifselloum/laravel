<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskWorkflowLogResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'task_id' => $this->task_id,
            'comment' => $this->comment,
            'performed_at' => $this->performed_at?->format('Y-m-d H:i:s'),
            'from_state' => $this->whenLoaded('fromState', fn() => [
                'id' => $this->fromState->id,
                'name' => $this->fromState->name,
                'color' => $this->fromState->color,
            ]),
            'to_state' => $this->whenLoaded('toState', fn() => [
                'id' => $this->toState->id,
                'name' => $this->toState->name,
                'color' => $this->toState->color,
            ]),
            'transition' => $this->whenLoaded('transition', fn() => [
                'id' => $this->transition->id,
                'name' => $this->transition->name,
            ]),
            'performed_by' => $this->whenLoaded('performedBy', fn() => [
                'id' => $this->performedBy->id,
                'name' => $this->performedBy->name,
            ]),
            'team' => $this->whenLoaded('team', fn() => [
                'id' => $this->team->id,
                'name' => $this->team->name,
                'color' => $this->team->color,
            ]),
        ];
    }
}
