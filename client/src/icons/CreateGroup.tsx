import { MegazordIcon } from "@components";
import { Group } from "@styled-icons/boxicons-regular";
import { Plus } from "@styled-icons/entypo";

function CreateGroup() {
    const size = "20px";

    return (
        <MegazordIcon
            width={size}
            height={size}
            icons={[
                {
                    icon: <Group />,
                    top: 3,
                    left: 5,
                    size: 1.3,
                },
                {
                    icon: <Plus />,
                    top: 0,
                    left: -7,
                    size: 0.8,
                },
            ]}
        />
    );
}

export default CreateGroup;
