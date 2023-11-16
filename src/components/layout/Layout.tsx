import { ReactNode } from "react"
import styles from './Layout.module.scss'
import MenuNavigate from "components/MenuNavigate"

interface LayoutProps {
    children : ReactNode,
}

export default function Layout({ children } : LayoutProps) {
    
    return (
        <div className={ styles.layout }>
            { children }
            <MenuNavigate/>
        </div>
    )
}