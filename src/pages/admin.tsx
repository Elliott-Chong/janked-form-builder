import Navbar from "@/components/Navbar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import type { GetServerSideProps } from "next";
import type { User } from "next-auth";
import React from "react";
type Props = {
    user: User;
};

const AdminPage = ({ user }: Props) => {
    const { data: allUsers } = api.form.getAllUsers.useQuery()


    return (
        <>
            <Navbar user={user} />
            <div className="grid max-w-3xl grid-cols-3 gap-4 py-10 mx-auto">
                {allUsers?.map(user => (
                    <div key={user.id} className="p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-sm font-light text-gray-400 dark:text-gray-300">{user.email}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-sm font-semibold text-gray-400 dark:text-gray-300">{user.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    if (!session?.user || session.user.role !== 'admin') {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        props: {
            user: session.user,
        },
    };
};

export default AdminPage;
