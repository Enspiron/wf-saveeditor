export interface Save {
    data_headers: DataHeaders;
    data:         Data;
}

export interface Data {
    user_info:                               UserInfo;
    premium_bonus_list:                      any[];
    expired_premium_bonus_list:              null;
    user_daily_challenge_point_list:         UserDailyChallengePointList[];
    bonus_index_list:                        any[];
    premium_bonus_index_list:                any[];
    premium_bonus_mailed_item_list:          any[];
    user_notice_list:                        UserNoticeList[];
    user_triggered_tutorial:                 number[];
    cleared_regular_mission_list:            { [key: string]: number };
    user_character_list:                     { [key: string]: UserCharacterList };
    user_character_mana_node_list:           { [key: string]: number[] };
    user_party_group_list:                   { [key: string]: UserPartyGroupList };
    item_list:                               { [key: string]: number };
    user_equipment_list:                     { [key: string]: UserEquipmentList };
    user_character_from_town_history:        UserCharacterFromTownHistory[];
    quest_progress:                          { [key: string]: QuestProgress[] };
    last_main_quest_id:                      number;
    gacha_info_list:                         GachaInfoList[];
    available_asset_version:                 string;
    should_prompt_takeover_registration:     boolean;
    has_unread_news_item:                    boolean;
    user_option:                             UserOption;
    drawn_quest_list:                        DrawnQuestList[];
    mail_arrived:                            boolean;
    user_periodic_reward_point_list:         UserPeriodicRewardPointList[];
    all_active_mission_list:                 { [key: string]: AllActiveMissionList };
    cleared_collect_item_event_mission_list: any[];
    box_gacha_list:                          BoxGachaList;
    gacha_campaign_list:                     GachaCampaignList[];
    purchased_times_list:                    { [key: string]: number };
    start_dash_exchange_campaign_list:       any[];
    multi_special_exchange_campaign_list:    MultiSpecialExchangeCampaignList[];
    associate_token:                         string;
    config:                                  { [key: string]: number };
}

export interface AllActiveMissionList {
    progress: number;
    stages:   Stages;
}

export interface Stages {
    "1": boolean;
}

export interface BoxGachaList {
    "1011": The1011[];
}

export interface The1011 {
    box_id:           number;
    reset_times:      number;
    remaining_number: number;
    is_closed:        boolean;
}

export interface DrawnQuestList {
    category_id: number;
    quest_id:    number;
    odds_id:     number;
}

export interface GachaCampaignList {
    campaign_id: number;
    gacha_id:    number;
    count:       number;
}

export interface GachaInfoList {
    gacha_id:              number;
    is_daily_first:        boolean;
    is_account_first:      boolean;
    gacha_exchange_point?: number;
}

export interface MultiSpecialExchangeCampaignList {
    campaign_id: number;
    status:      number;
}

export interface QuestProgress {
    quest_id:              number;
    finished:              boolean;
    high_score?:           number | string;
    clear_rank?:           number;
    best_elapsed_time_ms?: number;
    unlocked?:             boolean;
    host_finished?:        boolean;
    ranking_event?:        RankingEvent;
}

export interface RankingEvent {
    best_record: BestRecord;
}

export interface BestRecord {
    elapsed_time_ms: number;
    score:           number;
    is_accomplished: boolean;
}

export interface UserCharacterFromTownHistory {
    character_id: number;
}

export interface UserCharacterList {
    entry_count:            number;
    evolution_level:        number;
    over_limit_step:        number;
    protection:             boolean;
    join_time:              number;
    update_time:            number;
    exp:                    number;
    stack:                  number;
    bond_token_list:        BondTokenList[];
    mana_board_index:       number;
    ex_boost?:              ExBoost;
    illustration_settings?: number[];
}

export interface BondTokenList {
    mana_board_index: number;
    status:           number;
}

export interface ExBoost {
    status_id:       number;
    ability_id_list: number[];
}

export interface UserDailyChallengePointList {
    id:            number;
    point:         number;
    campaign_list: CampaignList[];
}

export interface CampaignList {
    campaign_id:      number;
    additional_point: number;
}

export interface UserEquipmentList {
    level:             number;
    enhancement_level: number;
    protection:        boolean;
    stack:             number;
}

export interface UserInfo {
    stamina:             number;
    stamina_heal_time:   number;
    boost_point:         number;
    boss_boost_point:    number;
    transition_state:    number;
    role:                number;
    name:                string;
    last_login_time:     Date;
    comment:             string;
    vmoney:              number;
    free_vmoney:         number;
    rank_point:          number;
    star_crumb:          number;
    bond_token:          number;
    exp_pool:            number;
    exp_pooled_time:     number;
    leader_character_id: number;
    party_slot:          number;
    degree_id:           number;
    birth:               number;
    free_mana:           number;
    paid_mana:           number;
    enable_auto_3x:      boolean;
}

export interface UserNoticeList {
    kind:   number;
    status: number;
}

export interface UserOption {
    gacha_play_no_rarity_up_movie: boolean;
    auto_play:                     boolean;
    number_notation_symbol:        boolean;
    payment_alert:                 boolean;
    room_number_hidden:            boolean;
    attention_sound_effect:        boolean;
    attention_vibration:           boolean;
    attention_enable_in_battle:    boolean;
    simple_ability_description:    boolean;
}

export interface UserPartyGroupList {
    list:     { [key: string]: List };
    color_id: number;
}

export interface List {
    name:                 string;
    character_ids:        number[];
    unison_character_ids: number[];
    equipment_ids:        number[];
    ability_soul_ids:     number[];
    edited:               boolean;
    options:              Options;
}

export interface Options {
    allow_other_players_to_heal_me: boolean;
}

export interface UserPeriodicRewardPointList {
    id:    number;
    point: number;
}

export interface DataHeaders {
    force_update: boolean;
    asset_update: boolean;
    short_udid:   number;
    viewer_id:    number;
    servertime:   number;
    result_code:  number;
}

//function that makes new equipment by id
export function makeEquipment(id: number): UserEquipmentList {
    return {
        level: 1,
        enhancement_level: 0,
        protection: false,
        stack: 1,
    }
}

//function that adds to equipmentlist
//only input needed is equipmentID
export function addEquipment(equipmentID: number, save: Save): void {
    save.data.user_equipment_list[equipmentID] = makeEquipment(equipmentID);
}

//function that removes equipment
export function removeEquipment(equipmentID: number, save: Save): void {
    delete save.data.user_equipment_list[equipmentID];
}

//function that makes a new character
export function makeCharacter(id: number): UserCharacterList {
    return {
        entry_count: 1,
        evolution_level: 1,
        over_limit_step: 0,
        protection: false,
        join_time: Date.now(),
        update_time: Date.now(),
        exp: 0,
        stack: 1,
        bond_token_list: [
            {
                "mana_board_index": 1,
                "status": 0
              },
              {
                "mana_board_index": 2,
                "status": 0
              }

        ],
        mana_board_index: 1
    }
}

//function that adds to characterlist
//only input needed is characterID
export function addCharacter(characterID: number, save: Save): void {
    save.data.user_character_list[characterID] = makeCharacter(characterID);
}


//function that removes character
export function removeCharacter(characterID: number, save: Save): Save {
    const updatedSave = save;
    delete updatedSave.data.user_character_list[characterID];
    return updatedSave;
}

//function that returns characters
export function getCharacters(save: Save): UserCharacterList[] {
    return Object.values(save.data.user_character_list);
}

//write to json file
export function writeSave(save: Save, filename: string): void {
    
    
}

export function isSave(save: any): save is Save {
    return (save as Save).data_headers !== undefined;
}

//get username
export function getUsername(save: Save): string {
    return save.data.user_info.name;
}

//make a save without data_headers
export function makeSave(data: Data): Save {
    return {
        data_headers: {
            force_update: false,
            asset_update: false,
            short_udid: 0,
            viewer_id: 0,
            servertime: 0,
            result_code: 0
        },
        data: data
    }
}