'use client';

import { FormEvent, useState } from "react";
import Select from "react-select";
import DatePicker from "@/components/DatePicker";
import { Course } from "@/utils/type";

const AddCourseForm: React.FC<{
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    course?: Course;
    openForm: boolean;
  }> = ({ handleSubmit, course, openForm}) => {
    const options = [
      {value: 'mathematique', label: 'Mathématique'},
      {value: 'histoire', label: 'Histoire'},
      {value: 'geographie', label: 'Géographie'},
      {value: 'francais', label: 'Français'},
    ];
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre du cours
          </label>
          <input 
            type="text" 
            name="title" 
            placeholder="Le nom du cours" 
            defaultValue={course?.title} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description du cours"
            defaultValue={course?.description}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Syllabus
          </label>
          <input 
            type="text" 
            name="syllabus" 
            placeholder="Syllabus du cours" 
            defaultValue={course?.syllabus??undefined}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matière
          </label>
          <Select
            options={options}
            isMulti={false}
            isSearchable={true}
            placeholder="Choisir la matière"
            name="matter"
            defaultValue={course?.matter ?? options[0]}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <DatePicker name="start_date" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <DatePicker name="end_date" />
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            {course ? "Mettre à jour" : "Ajouter le cours"}
          </button>
        </div>
      </form>
    );
  };


export default AddCourseForm;