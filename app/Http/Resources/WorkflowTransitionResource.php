<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowTransitionResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'requires_approval' => $this->requires_approval,
            'is_active' => $this->is_active,
            'from_state' => $this->whenLoaded('fromState', fn() => new WorkflowStateResource($this->fromState)),
            'to_state' => $this->whenLoaded('toState', fn() => new WorkflowStateResource($this->toState)),
            'team_permissions' => $this->whenLoaded('teamPermissions', fn() => 
                $this->teamPermissions->map(function ($permission) {
                    return [
                        'team_id' => $permission->team_id,
                        'team_name' => $permission->team->name,
                        'allowed_roles' => $permission->allowed_roles,
                    ];
                })
            ),
        ];
    }
}
