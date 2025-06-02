import * as DropdownMenu from 'zeego/dropdown-menu'
import {Ionicons} from "@expo/vector-icons";
import React, {CSSProperties} from "react";

export type Props = {
  menuOptions: {
      text: string;
      onSelect: () => void;
  }[]
    styles?: CSSProperties;
  trigger?: React.ReactNode;
  disable?: boolean;
}

export const Menu = ({menuOptions,styles,trigger,disable}: Props) => {
    return (
       <DropdownMenu.Root >
           <DropdownMenu.Trigger>
               {trigger ? trigger :  <Ionicons name="ellipsis-vertical" size={24} color="black" />}

           </DropdownMenu.Trigger>
           <DropdownMenu.Content style={styles}>
               {menuOptions.map((option, index) => (
                   <DropdownMenu.Item key={option.text} onSelect={option.onSelect} disabled={disable}>
                       <DropdownMenu.ItemTitle  >
                           {option.text}
                       </DropdownMenu.ItemTitle>
                   </DropdownMenu.Item>
               ))}
           </DropdownMenu.Content>
       </DropdownMenu.Root>
    );
};