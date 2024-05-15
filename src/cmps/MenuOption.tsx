export function MenuOption( { title }: { title: string }) {
    return (
        <div className="option ">
            <div className="title flex items-center justify-between cursor-pointer">
                <span>{ title }</span>
                <img className="w-3 h-3 bg-myBlue p-3 rounded-full" src="./arrowUp.png" alt="" />
            </div>
        </div>
    )
}