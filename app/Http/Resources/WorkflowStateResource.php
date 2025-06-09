<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowStateResource extends JsonResource
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
            'order' => $this->order,
            'is_initial' => $this->is_initial,
            'is_final' => $this->is_final,
            'is_active' => $this->is_active,
            'tasks_count' => $this->whenCounted('tasks'),
        ];
    }
}
