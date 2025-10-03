"use client";
import { LogoutButton } from "./LogoutButton";

export default function Navibar() {
    return (
        <header className="sticky inset-x-0 top-0 h-14 z-40
                       bg-blue-500/95 backdrop-blur border-b border-blue-400/40">


            <nav className="bg-gray-700 border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="https://stoix.dev/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="/logo.svg" className="h-8" alt="Flowbite Logo" />
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <LogoutButton />
                        <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border text-white  rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                            <li>
                                <a href="/painel" className="block py-2 px-3 md:p-0  hover:text-gray-400" aria-current="page">Início</a>
                            </li>
                            <li>
                                <a href="/painel/task" className="block py-2 px-3 md:p-0 hover:text-gray-400">+ Tarefa</a>
                            </li>
                            <li>
                                <a href="/painel/users" className="block py-2 px-3 md:p-0 hover:text-gray-400">+ Usuário</a>
                            </li>
                            <li>
                                <a href="#" className="block py-2 px-3 md:p-0 hover:text-gray-400">Contato</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </header >
    );
}