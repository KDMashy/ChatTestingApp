<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewMessages extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender',
        'receiver',
        'message',
        'sent_date',
        'edited',
        'deleted',
    ];
}
