<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'color' => $this->color,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'creator' => $this->whenLoaded('creator', fn() => new UserResource($this->creator)),
            'members' => $this->whenLoaded('members', function() {
                return $this->members->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'email' => $member->email,
                        'pivot' => [
                            'role' => $member->pivot->role,
                            'is_active' => $member->pivot->is_active,
                            'joined_at' => $member->pivot->joined_at ? $member->pivot->joined_at->format('Y-m-d H:i:s') : null,
                            'added_by' => $member->pivot->added_by,
                        ],
                    ];
                });
            }),
            'members_count' => $this->whenCounted('members'),
            'workflow_permissions' => $this->whenLoaded('workflowPermissions', fn() => 
                $this->workflowPermissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'transition_id' => $permission->transition_id,
                        'allowed_roles' => $permission->allowed_roles,
                        'transition' => $this->whenLoaded('transition', fn() => [
                            'id' => $permission->transition->id,
                            'name' => $permission->transition->name,
                            'from_state' => $permission->transition->fromState->name,
                            'to_state' => $permission->transition->toState->name,
                        ]),
                    ];
                })
            ),
        ];
    }
}
