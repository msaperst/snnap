import React, { useEffect, useState } from 'react';
import SnnapFormMultiSelect from '../../../SnnapForms/SnnapFormMultiSelect';
import SnnapFormTextarea from '../../../SnnapForms/SnnapFormTextarea';
import { jobService } from '../../../../services/job.service';

function EquipmentSelect(props) {
  const { company, onChange } = props;
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);

  useEffect(() => {
    jobService.getEquipment().then((equip) => {
      setEquipment(equip);
    });
    if (company && company.equipment) {
      setEquipmentItems(company.equipment);
      setFormData(company.equipment);
    }
  }, [company]);

  if (company === undefined) {
    return null;
  }

  const addInput = (_key, value) => {
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
      `${p.name} Equipment List` === key ? { ...p, what: value } : p
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
        <SnnapFormTextarea
          key={obj.value}
          name={`${obj.name} Equipment List`}
          value={obj.what}
          onChange={updateEquipment}
        />
      ))}
    </>
  );
}

export default EquipmentSelect;
