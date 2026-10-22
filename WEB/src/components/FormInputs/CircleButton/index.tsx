import { Badge, IconButton, Tooltip } from "@mui/material";
import { ButtonColor, CircleButtonProps, SFC } from "../../../types";
import { colors } from "../../../styles";

export const CircleButton : SFC<CircleButtonProps> = ({ClassName, IsNotification = false, OnClick, Icon, Type, Color, Title='', Disabled=false}) => {
    const renderColor = () => {
        switch(Color){
            case ButtonColor.default:
                return {bg:'', hover:''}
            default:
                return {bg:colors.palette.neutral['100'],hover:colors.palette.neutral['200']}
        }
    }
    return (
        <>
        <div className={ClassName}>
            <Tooltip title={Title} >
                <IconButton onClick={OnClick} sx={{ backgroundColor: renderColor().bg,'&:hover': {backgroundColor: renderColor().hover,}}} type={Type} disabled={Disabled}>
                    <Badge color={IsNotification ? 'error' : 'default'}  overlap="circular" variant={IsNotification ? 'dot' : 'standard'} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} >
                        {Icon}
                    </Badge>
                </IconButton>
            </Tooltip>
        </div>
        </>
    )
}