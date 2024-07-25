"use client";
import React from "react";
import UnitEditDialog from "./UnitEditDialog";
import character_id from './character.json';
interface CharacterId {
    [key: string]: string[];
}

interface UserCharacterList {
    [key: string]: any;
}

interface Character {
    devnickname: string;
    id: string;
    code: string;
}

interface Props {
    userlist?: {
        data?: {
            user_character_list?: UserCharacterList;
        };
    };
}

const characterId: CharacterId = character_id as unknown as CharacterId;

const searchDevNameById = (id: string): string | undefined => {
    return characterId[id]?.[0];
};

const checkOwnedCharacters = (userList: UserCharacterList = {}): Record<string, string> => {
    const ownedChars: Record<string, string> = {};
    for (const key in userList) {
        const devName = searchDevNameById(key);
        if (devName) {
            ownedChars[devName] = key;
        }
    }
    return ownedChars;
};

export default function Characters({ userlist }: Props) {
    if (!userlist?.data?.user_character_list) {
        console.warn("fileContent, fileContent.data, or fileContent.data.user_character_list is undefined");
        return <div>No data available</div>;
    }

    const userCharacterList = userlist.data.user_character_list;
    const ownedCharacters = checkOwnedCharacters(userCharacterList);

    const makeCharacterList = (): Character[] => {
        return Object.keys(characterId).map(key => ({
            devnickname: characterId[key]?.[0] || '',
            id: key,
            code: characterId[key]?.[17] || '',
        }));
    };

    const characterList = makeCharacterList();

    // console.log("Owned Characters:", ownedCharacters);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: '100vh',
                padding: '30px 0',
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
                {characterList.map(character => (
                    <div key={character.id}>
                        <UnitEditDialog 
                            devnickname={character.devnickname} 
                            characterId={character.id} 
                            ownedunits={ownedCharacters} 
                            code={character.code}

                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
