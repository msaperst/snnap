import React, { useEffect, useState } from 'react';
import SnnapFormMultiSelect from '../../../SnnapForms/SnnapFormMultiSelect';
import { jobService } from '../../../../services/job.service';
import SnnapFormInput from '../../../SnnapForms/SnnapFormInput';

function EquipmentSelect(props) {
  const { company, onChange } = props;
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);

  useEffect(() => {
    jobService.getEquipment().then((equipment) => {
      setEquipment(equipment);
    });
    if (company && company.equipment) {
      setEquipmentItems(company.equipment);
      setFormData(company.equipment);
    }
  }, [company]);

  const addInput = (key, value) => {
    const data = [];
    // eslint-disable-next-line array-callback-return
    value.map((obj) => {
      const elementIndex = formData.findIndex((p) => p.name === obj.label);
      data.push({
        value: obj.value,
        name: obj.label,
        what: formData[elementIndex] ? formData[elementIndex].what : '',
      });
    });
    setEquipmentItems(data);
    setFormData(data);
    onChange('Equipment', data);
  };

  const updateEquipment = (key, value) => {
    const data = formData.map((p) =>
      p.name === key ? { ...p, what: value } : p
    );
    setFormData(data);
    onChange('Equipment', data);
  };

  return (
    <>
      <SnnapFormMultiSelect
        name="Equipment"
        values={equipmentItems}
        onChange={addInput}
        options={equipment}
      />
      {equipmentItems.map((obj) => (
        <SnnapFormInput
          key={obj.value}
          name={obj.name}
          value={obj.what}
          onChange={updateEquipment}
        />
      ))}
    </>
  );
}

export default EquipmentSelect;
