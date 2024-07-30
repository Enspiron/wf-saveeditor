"use client";
import React from "react";
import EquipmentEditDialog from "./EquipmentEditDialog";
const equipment_id = require('./equipment.json');
const enhanceable = require('./equipment_enhancement.json');

interface Equipment {
  devnickname: string;
  id: string;
}

interface EquipmentIdData {
  [id: string]: string[]; // Each ID maps to an array of strings (likely names)
}

interface UserEquipment {
  level: number;
  enhancement_level: number;
  protection: boolean;
  stack: number;
}

interface FileContent {
  data: {
    user_equipment_list: Record<string, UserEquipment>;
  };
}

interface Props {
  fileContent: FileContent | null; // Allow fileContent to be null
  setFileContent: React.Dispatch<React.SetStateAction<any>>;
}

const Equipment: React.FC<Props> = (props:any) => {
  const equipmentList: Equipment[] = [];

  const searchDevNameById = (id: string): string | undefined => {
    return equipment_id[id]?.[0]; // Use optional chaining for safety
  };

  const checkOwnedEquipment = (): Record<string, string> => {
    const userEquipmentList = props.fileContent?.data.user_equipment_list || {}; // Default to empty object if fileContent is null
    const ownedEquipment: Record<string, string> = {};

    Object.keys(userEquipmentList).forEach(key => {
      const devName = searchDevNameById(key);
      if (devName) {
        ownedEquipment[devName] = key;
      }
    });

    return ownedEquipment;
  };

  const getEnhancementLevel = (id: string): number | undefined | boolean => { 
    return enhanceable[id] ? props.fileContent?.data.user_equipment_list[id]?.enhancement_level : false;
  }

  const getLevel = (id: string): number | undefined => {
    return props.fileContent?.data.user_equipment_list[id]?.level;
  }

  const makeEquipmentList = (): Record<string, string> => {
    const equipmentList: Record<string, string> = {};

    Object.keys(equipment_id).forEach(key => {
      equipmentList[equipment_id[key][0]] = key;
    });

    return equipmentList;
  };

  const equipmentListData = makeEquipmentList();

  Object.keys(equipmentListData).forEach(key => {
    equipmentList.push({ devnickname: key, id: equipmentListData[key] });
  });

  const ownedEquipment = checkOwnedEquipment();

  //go through enhancement list and make a list of the keys
  const enhanceableList: Record<string, string> = {};
  const enhanceables: string[] = [];
  Object.keys(enhanceable).forEach(key => {
    enhanceables.push(key);
  });

  console.log(getEnhancementLevel("5010070"));

  return (
    <div
    style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        padding: '10px 0',
     
    }}
    >

    <div
    style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(15, 1fr)',
        boxSizing: 'border-box',
        justifyContent: 'center',
    }}
    >
      {equipmentList.map(equip => (
          <EquipmentEditDialog
          key={equip.id}
          devnickname={equip.devnickname}
          ownedequips={ownedEquipment}
          equip_id={equip.id}
          enhanceable={enhanceables.includes(equip.id)}
          level={getEnhancementLevel(equip.id)}
          fileContent={props.fileContent}
          upgrade={getLevel(equip.id)}
          />
        ))}
    </div>
    </div>
  );
}

export default Equipment;
