import styled from "styled-components"

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  background-color:#fff;
  position: fixed;
  left: 50%;
  right: 0;
  transform:translateX(-50%);
  bottom: 0;
  height: 60px;
  padding: 0 6px;
  border-top: 1px solid var(--color-gray-medium);
  z-index: 1000;
`

export default function TextField() {
    return (
        <Container>
        </Container>
    )
}