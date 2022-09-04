import styles from './styles.module.scss'
import RouterEndpoints from '@/common/RouterEndpoints';
import { Link, useNavigate, useParams } from '@solidjs/router';
import { createSignal, For, onMount } from 'solid-js';
import useStore from '@/chat-api/store/useStore';
import SettingsBlock from '@/components/ui/settings-block';
import Button from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { createServerRole } from '@/chat-api/services/ServerService';
import { ServerRole } from '@/chat-api/store/useServerRoles';



function RoleItem(props: { role: ServerRole }) {
  const { serverId } = useParams();

  const link = RouterEndpoints.SERVER_SETTINGS_ROLE(serverId, props.role.id);

  return (
    <Link href={link} class={styles.roleItem}>
      <Icon name='storage' size={18} />
      <div class={styles.name}>{props.role.name}</div>
      <Icon name='navigate_next' />
    </Link>
  )
}


function RoleList() {
  const { serverId } = useParams();
  const { serverRoles } = useStore();
  const roles = () => serverRoles.getAllByServerId(serverId);

  return (
    <div class={styles.roleList}>
      <For each={roles()}>
        {role => <RoleItem role={role} />}
      </For>
    </div>
  )
}




export default function ServerSettingsRole() {
  const { serverId } = useParams();
  const { tabs } = useStore();
  const navigate = useNavigate();
  const [roleAddRequestSent, setRoleAddRequestSent] = createSignal(false);


  onMount(() => {
    tabs.openTab({
      title: "Settings - Roles",
      serverId: serverId!,
      iconName: 'settings',
      path: RouterEndpoints.SERVER_SETTINGS_ROLES(serverId!),
    });
  })

  const onAddRoleClicked = async () => {
    if (roleAddRequestSent()) return;
    setRoleAddRequestSent(true);

    const role = await createServerRole(serverId!)
      .finally(() => setRoleAddRequestSent(false))

    navigate(RouterEndpoints.SERVER_SETTINGS_ROLE(serverId!, role.id))
  }


  return (
    <div class={styles.rolesPane}>
      <div class={styles.title}>Roles</div>
      <SettingsBlock label='Add a new role' icon='add'>
        <Button label='Add Role' onClick={onAddRoleClicked} />
      </SettingsBlock>
      <RoleList />
    </div>
  )
}
