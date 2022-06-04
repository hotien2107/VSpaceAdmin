export type TableListItem = {
  id: number;
  name: string;
  nameUser: string;
  createdAt: string;
  status: 'active'| 'blocked';
};

export type OfficeDetail = {
  id: number;
  name: string;
  invitationCode: string;
  status: 'active'| 'blocked';
  createdBy: {
    id: number;
    name: string;
    avatar?: string;
  };
  officeItems: any[];
  officeMembers: OfficeMembersInterface[];
  createdAt: string;
}

type OfficeMembersInterface = {
  id: number;
  officeId: number;
  member: {
    id: number;
    name: string;
    avatar?: string;
  };
  onlineStatus: string;
  transform: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  };
}


export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
  name: string;
};
