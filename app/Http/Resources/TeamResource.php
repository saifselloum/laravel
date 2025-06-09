<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'project_id' => $this->project_id,
            'team_leader_id' => $this->team_leader_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'leader' => $this->whenLoaded('leader', function() {
                return new UserResource($this->leader);
            }),
            'members' => $this->whenLoaded('members', function() {
                return TeamMemberResource::collection($this->members);
            }),
            'project' => $this->whenLoaded('project', function() {
                return new ProjectResource($this->project);
            }),
        ];
    }
}
