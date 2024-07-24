export default function EquipmentEditDialog(props:any) {
    const ownedEquips = props.ownedequips;
    const isEquipOwned = () => {
        for (let key in ownedEquips) {
            if (ownedEquips[key] === props.equip_id) {
                return true;
            }
        }
    }

    return (
        <div

        >
        <img 
                style={{
                    display: 'flex',
                    width: '56px',
                    height: '56px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '3px',
                    margin: '2px',
                    border: '3px solid #000',
                    boxShadow: '0 0 1px 1px 0 #000',
                    backgroundColor: isEquipOwned() ? '#FFF' : '#000',
                    filter: isEquipOwned() ? 'none' : 'brightness(50%)'
                }}
                src={`https://eliya-bot.herokuapp.com/img/assets/item/equipment/${props.devnickname}.png`} 
                alt={props.devnickname}
        />
        </div>
    );
}