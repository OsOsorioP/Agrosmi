import { IconSymbol } from '../components/ui/IconSymbol';

const icon:any = {
    index: (props:any) => <IconSymbol name='message.fill' size={24} {...props}/>,
    clima: (props:any) => <IconSymbol name='cloud.fill' size={24} {...props}/>,
    parcelas: (props:any) => <IconSymbol name='map.fill' size={24} {...props}/>,
    chats: (props:any) => <IconSymbol name='archive.fill' size={24} {...props}/>,
    usuario: (props:any) => <IconSymbol name='user.fill' size={24}{...props}/>,
}

export default icon;