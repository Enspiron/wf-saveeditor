"use client";
import React from "react";
import Save from '../save';
import character_id from './character.json';
import UnitEditDialog from "./UnitEditDialog";

interface CharacterId {
    [key: string]: string[] | undefined;
}

interface UserCharacterList {
    [key: string]: any;
}

interface Character {
    devnickname: string;
    id: string;
}

interface Props {
    userlist?: {
        data?: {
            user_character_list?: UserCharacterList;
        };
    };
}

const characterId: CharacterId = character_id;

const searchDevNameById = (id: string): string | undefined => {
    for (let key in characterId) {
        if (key === id && characterId[key]) {
            return characterId[key][0];
        }
    }
    return undefined;
};

const checkOwnedCharacters = (userList: UserCharacterList | undefined): Record<string, string> => {
    const ownedChars: Record<string, string> = {};
    if (!userList) {
        console.warn("userList is undefined");
        return ownedChars;
    }
    for (let key in userList) {
        const devName = searchDevNameById(key);
        if (devName) {
            ownedChars[devName] = key;
        }
    }
    return ownedChars;
};

export default function Characters(props: Props) {
    const fileContent = props.userlist;

    if (!fileContent || !fileContent.data || !fileContent.data.user_character_list) {
        console.warn("fileContent, fileContent.data, or fileContent.data.user_character_list is undefined");
        return <div>No data available</div>;
    }

    const ownedCharacters = checkOwnedCharacters(fileContent.data.user_character_list);

    const makeCharacterList = (): Character[] => {
        const chars: Character[] = [];
        for (let key in character_id) {
            if (character_id[key]) {
                chars.push({ devnickname: character_id[key][0], id: key });
            }
        }
        return chars;
    };

    const characterList = makeCharacterList();

    console.log("Owned Characters:", ownedCharacters);

    return (
        <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
            
        }}
        >

            {characterList.map((character) => (
                <div key={character.id}>
                    <UnitEditDialog devnickname={character.devnickname} characterId={character.id} ownedunits={ownedCharacters} />
                </div>
            ))}
        </div>
    );
}
