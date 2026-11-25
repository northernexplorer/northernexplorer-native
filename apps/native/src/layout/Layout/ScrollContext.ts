import {ComponentRef, createContext} from 'react';
import {View} from 'react-native';

export const ScrollContext = createContext<(target: ComponentRef<typeof View>) => void>(() => undefined);
