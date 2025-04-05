import {
  Navbar,
  NavbarBrand,
  NavbarText,
} from 'reactstrap';

function NavbarNav(args) {
  return (
    <div>
      <Navbar {...args}>
        <NavbarBrand href="/">Buy and Go</NavbarBrand>
          <NavbarText>Jose Palzamos</NavbarText>       
      </Navbar>
    </div>
  );
}

export default NavbarNav;