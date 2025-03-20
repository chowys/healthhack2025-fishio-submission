

export type AppointmentType = {
    appointment_id: string;
    start_datetime: {
        _seconds: number;
        _nanoseconds: number;
    };
    end_datetime: {
        _seconds: number;
        _nanoseconds: number;
    };
    appointment_title: string | undefined; 
    appointment_description: string | undefined;
    appointment_status: "pending" | "accepted" | "completed" | "cancelled";
    physioClinic_id: string;
    physioTherapist_id: string;
    user_id: string;
    patient: PatientType;
    recoveryPlan: RecoveryPlanType | undefined;
    created_at: string | Date;
    updated_at: string | Date;
}

export type PatientType = {
    user_id: string;
    user_name: string;
    user_email: string;
    user_address?: string;
    preferred_physio_specialty?: string[];
    user_goals?: string[];

}

export type EventType = {
    appointment_id: string;
    title?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    desc?: string;
}

export type RecoveryPlanType = {
    recoveryPlan_id: string;
    recoveryPlan_name: string;
    recoveryPlan_description: string;
    user_id: string;
    physioTherapist_id: string;
    physioClinic_id: string;
    appointment_status: "pending" | "accepted" | "completed" | "cancelled";
    created_at: string | Date;
    updated_at: string | Date;
}

export type ExercisePlanType = {
    exercisePlan_id: string;
    appointment_id: string;
    exercisePlan_name: string;
    exercisePlan_description: string;
    user_id: string;
    physioTherapist_id: string;
    physioClinic_id: string;
    exercises: {
        [key: string]: {
            [ExercisePlan_ExerciseType_id : string] : {
                status: "completed" | "incomplete";
                exercise_name: string;
                exercise_description: string;
            };
        }
    };
    appointment_status: "pending" | "accepted" | "completed" | "cancelled";
    created_at: string | Date;
    updated_at: string | Date;
}

export type ExercisePlan_ExerciseType = {
    exercisePlan_ExerciseType: string;
    exercisePlan_id: string;
    exercise : ExerciseType;
    exercise_date: string | Date;
    exercise_sets : number;
    exercise_reps : number;
    exercise_duration_sec : number;
    exercise_status: "completed" | "incomplete";
    created_at: string | Date;
    updated_at: string | Date;
}

export type ExerciseType = {
    physioTherapist_id: string;
    physioClinic_id: string;
    exercise_id: string;
    exercise_name: string;
    exercise_description: string;
    exercise_video_URL: string | undefined;
    exercise_image_URL: string | undefined;
    created_at: string | Date;
    updated_at: string | Date;
}