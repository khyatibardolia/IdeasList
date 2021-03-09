import React from 'react';
import Header from '../header/Header';

export const Navigation = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> => ({...props}) => {
    return (
        <>
            <Header/>
            <div className={'w-100 h-100'}>
                <Component {...props as P}/>
            </div>
        </>
    );
};
