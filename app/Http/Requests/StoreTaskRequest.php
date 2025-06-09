<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ['required', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
            "description" => ['nullable', 'string'],
            'due_date' => ['nullable', 'date', 'after:today'],
            'project_id' => ['required', 'exists:projects,id'],
            'team_id' => ['nullable', 'exists:teams,id'],
            'assigned_user_id' => ['nullable', 'exists:users,id'],
            'status' => [
                'required',
                Rule::in(['pending', 'in_progress', 'completed'])
            ],
            'priority' => [
                'required',
                Rule::in(['low', 'medium', 'high'])
            ]
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'project_id.required' => 'Please select a project for this task.',
            'project_id.exists' => 'The selected project does not exist.',
            'due_date.after' => 'The due date must be a future date.',
            'image.max' => 'The image must not be larger than 2MB.',
        ];
    }
}
