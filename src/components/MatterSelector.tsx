"use client";
import { useVelocity } from "framer-motion";
import { useEffect } from "react";
import Select from "react-select";

const TagSelector: React.FC<{
    tags: string[];
    selectedTags?: string[];
    setSelectedTags: (tags: string[]) => void;
    className?: string;
    id?: string;
}> = ({ tags, selectedTags, setSelectedTags, className, id }) => {

  const options = tags.map((tag) => ({ value: tag, label: tag}));
  
  useEffect(() => {

  }, [])

  return (
    <div className={className}>
        <Select
            options={options}
            isMulti = {false} 
            isSearchable={true}
            placeholder="chercher et la matjmiere "
            value={selectedTags?.map(tag => ({ value: tag, label: tag}))}
            onChange={e => setSelectedTags(e.map(opt => (opt.value)))}
            id={id}
    />
    </div>
  );
};

export default TagSelector;